-- CreateTable
CREATE TABLE "SystemRole" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemPermission" (
    "id" TEXT NOT NULL,
    "resource" VARCHAR(50) NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemUser" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SystemPermissionToSystemRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SystemPermissionToSystemRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemRole_name_key" ON "SystemRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemPermission_resource_action_key" ON "SystemPermission"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "SystemUser_email_key" ON "SystemUser"("email");

-- CreateIndex
CREATE INDEX "_SystemPermissionToSystemRole_B_index" ON "_SystemPermissionToSystemRole"("B");

-- AddForeignKey
ALTER TABLE "SystemUser" ADD CONSTRAINT "SystemUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "SystemRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SystemPermissionToSystemRole" ADD CONSTRAINT "_SystemPermissionToSystemRole_A_fkey" FOREIGN KEY ("A") REFERENCES "SystemPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SystemPermissionToSystemRole" ADD CONSTRAINT "_SystemPermissionToSystemRole_B_fkey" FOREIGN KEY ("B") REFERENCES "SystemRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
