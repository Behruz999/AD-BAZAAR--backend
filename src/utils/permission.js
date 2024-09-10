const RoleTable = require("./roleTables");

module.exports = (resource, allowed) => {
  const isAllowed = (roleData) => {
    const permissions =
      roleData?.find((r) => r.resource === resource)?.permissions || [];
    return permissions.some((p) => allowed.includes(p));
  };

  return (req, res, next) => {
    const userRole = req?.user?.role;
    if (userRole) {
      const roleData = RoleTable[userRole] || [];
      if (isAllowed(roleData)) {
        return next();
      }
    }
    return res
      .status(403)
      .json({ msg: `Access denied: permission is not allowed!` });
  };
};
