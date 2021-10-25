"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    hostname: 'localhost',
    port: 3000,
    secretKey: "iusng8983hyhg29faxj28gr",
    db: {
        user: "postgres",
        host: "localhost",
        database: "gis_database",
        password: "MoveForward2001",
        port: 5432
    },
    jwtExpirationTime: 3600
};
