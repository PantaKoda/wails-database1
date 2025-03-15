export const DATABASE_TYPES = [
    { id: "postgresql", name: "PostgreSQL", icon: "/assets/database-icons/postgresql.svg" },
    { id: "mysql", name: "MySQL", icon: "/assets/database-icons/mysql.svg" },
    { id: "sqlite", name: "SQLite", icon: "/assets/database-icons/sqlite.svg" },
    { id: "mssql", name: "MS SQL Server", icon: "/assets/database-icons/mssql.svg" },

];

export function getDatabaseTypeById(id: string) {
    return DATABASE_TYPES.find(db => db.id === id);
}

export function getDatabaseIcon(id: string) {
    const dbType = getDatabaseTypeById(id);
    return dbType ? dbType.icon : '';
}