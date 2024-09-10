const RoleTable = {
  admin: [
    { resource: "user", permissions: ["read", "write", "update", "delete"] },
    { resource: "seller", permissions: ["read", "write", "update", "delete"] },
    {
      resource: "announcement",
      permissions: ["read", "write", "update", "delete"],
    },
    { resource: "section", permissions: ["read", "write", "update", "delete"] },
    {
      resource: "category",
      permissions: ["read", "write", "update", "delete"],
    },
  ],
  seller: [
    // { resource: "user", permissions: ["read"] },
    { resource: "seller", permissions: ["read", "write", "update", "delete"] },
    {
      resource: "announcement",
      permissions: ["read", "write", "update", "delete"],
    },
  ],
};

module.exports = RoleTable;
