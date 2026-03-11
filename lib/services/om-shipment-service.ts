import prisma from "@/lib/prisma";
import {
  OMShipmentBoxCreateSchema,
  OMShipmentBoxUpdateSchema,
  OMShipmentBoxContentCreateSchema,
  OMShipmentBoxContentUpdateSchema,
} from "@/lib/validations/om";

export class OMShipmentService {
  /**
   * Validate that the total packed quantity for an item doesn't exceed dispatch quantity
   */
  private static async validatePackedQuantity(
    dispatchOrderId: string,
    dispatchOrderItemId: string,
    quantityChange: number
  ) {
    // 1. Get the dispatch item to know its total allowed quantity
    const dispatchItem = await prisma.oMDispatchOrderItem.findUnique({
      where: { id: dispatchOrderItemId },
      include: {
        shipmentBoxContents: {
          include: {
            shipmentBox: true,
          },
        },
      },
    });

    if (!dispatchItem) {
      throw new Error("Dispatch Order Item not found");
    }

    // 2. Calculate current total packed quantity
    // Total = Sum(quantityPerBox * numberOfBoxes)
    const currentPacked = dispatchItem.shipmentBoxContents.reduce((sum, content) => {
      return sum + content.quantityPerBox * content.shipmentBox.numberOfBoxes;
    }, 0);

    const newPackedTotal = currentPacked + quantityChange;

    if (newPackedTotal > dispatchItem.quantity) {
      throw new Error(
        `Packed quantity (${newPackedTotal}) cannot exceed dispatch quantity (${dispatchItem.quantity}) for item.`
      );
    }
  }

  /**
   * Fetch all shipment details for a dispatch
   */
  static async getDispatchShipmentDetails(dispatchOrderId: string) {
    const shipmentBoxes = await prisma.oMShipmentBox.findMany({
      where: { dispatchOrderId },
      include: {
        contents: {
          include: {
            dispatchOrderItem: {
              include: {
                purchaseOrderItem: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return shipmentBoxes.map((box) => ({
      boxId: box.id,
      boxNumber: box.boxLabel,
      length: box.length,
      width: box.width,
      height: box.height,
      numberOfBoxes: box.numberOfBoxes,
      contents: box.contents.map((c) => ({
        contentId: c.id,
        itemId: c.dispatchOrderItem.purchaseOrderItem.productId,
        itemName: c.dispatchOrderItem.purchaseOrderItem.product.name,
        quantity: c.quantityPerBox,
        dispatchOrderItemId: c.dispatchOrderItemId,
      })),
    }));
  }

  /**
   * Create a new shipment box
   */
  static async createShipmentBox(dispatchOrderId: string, data: any) {
    const validated = OMShipmentBoxCreateSchema.parse(data);

    return await prisma.oMShipmentBox.create({
      data: {
        dispatchOrderId,
        boxLabel: validated.boxNumber?.toString() || "New Box",
        length: validated.length,
        width: validated.width,
        height: validated.height,
        numberOfBoxes: validated.numberOfBoxes,
      },
    });
  }

  /**
   * Update an existing shipment box
   */
  static async updateShipmentBox(boxId: string, data: any) {
    const validated = OMShipmentBoxUpdateSchema.parse(data);

    // If numberOfBoxes is changing, we need to re-validate ALL contents in this box
    if (validated.numberOfBoxes !== undefined) {
      const box = await prisma.oMShipmentBox.findUnique({
        where: { id: boxId },
        include: { contents: true },
      });

      if (box && box.numberOfBoxes !== validated.numberOfBoxes) {
        // For each content item, check if the new total exceeds limits
        for (const content of box.contents) {
          const change =
            content.quantityPerBox * validated.numberOfBoxes -
            content.quantityPerBox * box.numberOfBoxes;
          
          await this.validatePackedQuantity(box.dispatchOrderId, content.dispatchOrderItemId, change);
        }
      }
    }

    return await prisma.oMShipmentBox.update({
      where: { id: boxId },
      data: {
        boxLabel: validated.boxNumber?.toString(),
        length: validated.length,
        width: validated.width,
        height: validated.height,
        numberOfBoxes: validated.numberOfBoxes,
      },
    });
  }

  /**
   * Delete a shipment box
   */
  static async deleteShipmentBox(boxId: string) {
    return await prisma.oMShipmentBox.delete({
      where: { id: boxId },
    });
  }

  /**
   * Add content to a box
   */
  static async addBoxContent(boxId: string, data: any) {
    const validated = OMShipmentBoxContentCreateSchema.parse(data);

    const box = await prisma.oMShipmentBox.findUnique({
      where: { id: boxId },
    });

    if (!box) throw new Error("Shipment Box not found");

    // Total increase = quantityPerBox * numberOfBoxes
    const totalChange = validated.quantity * box.numberOfBoxes;
    await this.validatePackedQuantity(box.dispatchOrderId, validated.dispatchOrderItemId, totalChange);

    return await prisma.oMShipmentBoxContent.create({
      data: {
        shipmentBoxId: boxId,
        dispatchOrderItemId: validated.dispatchOrderItemId,
        quantityPerBox: validated.quantity,
      },
      include: {
        dispatchOrderItem: {
          include: {
            purchaseOrderItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update quantity of content in a box
   */
  static async updateBoxContent(contentId: string, data: any) {
    const validated = OMShipmentBoxContentUpdateSchema.parse(data);

    const content = await prisma.oMShipmentBoxContent.findUnique({
      where: { id: contentId },
      include: { shipmentBox: true },
    });

    if (!content) throw new Error("Box content not found");

    const totalChange =
      (validated.quantity - content.quantityPerBox) * content.shipmentBox.numberOfBoxes;

    await this.validatePackedQuantity(
      content.shipmentBox.dispatchOrderId,
      content.dispatchOrderItemId,
      totalChange
    );

    return await prisma.oMShipmentBoxContent.update({
      where: { id: contentId },
      data: {
        quantityPerBox: validated.quantity,
      },
    });
  }

  /**
   * Remove content from a box
   */
  static async removeBoxContent(contentId: string) {
    return await prisma.oMShipmentBoxContent.delete({
      where: { id: contentId },
    });
  }
}
