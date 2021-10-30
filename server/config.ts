type ServerConfig = {
    [index: string]: any;
    mime: {
        [index:string]:string;
    }
}

const config:ServerConfig = {
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

    jwtExpirationTime: 3600,

    mime: {
        ".html": "text/html",
        ".js": "application/javascript",
        ".map": "application/json",
        ".json": "application/json",
        ".css": "text/css",
        ".ttf": "application/octet-stream",
        ".wasm": "application/wasm",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2",
        ".wsv": "application/octet-stream",
        ".svg": "image/svg+xml"
    }
};


export default config;