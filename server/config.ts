type ServerConfig = {
    hostname: string,
    port: number,
    secretKey: string,
    db: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number,
    },
    jwtExpirationTime: number,
    mime: MimeMap,
}

type MimeMap = { [index: string]: string };

const config: ServerConfig = {
    hostname: '0.0.0.0',
    port: 80,

    secretKey: "iusng8983hyhg29faxj28gr",

    db: {
        user: "postgres",
        host: "localhost",
        database: "gis_database",
        password: "MoveForward2001",
        port: 5432
    },

    jwtExpirationTime: 3600,

    mime: {
        //Basic
        ".html": "text/html",
        ".js": "application/javascript",
        ".map": "application/json",
        ".json": "application/json",
        ".css": "text/css",
        //Font MIME
        ".ttf": "application/octet-stream",
        ".wasm": "application/wasm",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2",
        ".wsv": "application/octet-stream",
        //Image MIME
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".png": "image/png",
    }
};


export default config;