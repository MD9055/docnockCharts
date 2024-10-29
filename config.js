const config = {
    local: {
        DB: {
            HOST: "127.0.0.1",
            PORT: "27017",
            DATABASE: "medtool",
            UserName: "",
            Password: "",
           
        },
        FRONTEND:{
            HOST:'localhost',
            PORT:4200
        },
       
        PORTS: {
            API_PORT: 4001,
        },
        EMAIL: {
            host: "smtp.gmail.com",
            user: "medtoolsystems@gmail.com",
            password: "jxflzmgarmxuhddm",
        },
        cryptoSecret: "Cadence@08$08#2022",
        JWTSECRET: {
            JWT: "medtool@2023",
            EXPIRYTIME:"72h"
        },
        ENCRYPTION: {
            algorithm: "aes-256-cbc",
            iv: "Cadence@08$08#2022"
        },
        CRYPTOJS:{
            SECRETKEY:"medtool@2024"
        },
        AWS:{
            imagePrefix : "https://medtool-2024.s3.us-west-2.amazonaws.com/",
            AWS_accessKeyId:"AKIA5HWIAFCL3X44KN74",
            AWS_secretAccessKey:"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",
            AWS_region:"us-west-2"
        }
    },

    staging: {
        DB:{
            HOST: "0.0.0.0",
            PORT: "27017",
            DATABASE: "test",
            MONGOOSE:{
                useUndifinedTopology: true,
                useNewUrlParser: true
            },
            UserName: "medtoolsystems",
            Password: "QFoyWLCUsdKlpIYr"
        },


       
        PORTS: {
            API_PORT: 4001,
        },
        EMAIL: {
            host: "smtp.gmail.com",
            user: "medtoolsystems@gmail.com",
            password: "jxflzmgarmxuhddm",
        },
        cryptoSecret: "Cadence@08$08#2022",
        JWTSECRET: {
            JWT: "medtool@2023",
            EXPIRYTIME:"72h"
        },
        ENCRYPTION: {
            algorithm: "aes-256-cbc",
            iv: "Cadence@08$08#2022"
        },
        CRYPTOJS:{
            SECRETKEY:"medtool@2024"
        },
        AWS:{
            imagePrefix : "https://medtool-2024.s3.us-west-2.amazonaws.com/",
            AWS_accessKeyId:"AKIA5HWIAFCL3X44KN74",
            AWS_secretAccessKey:"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",
            AWS_region:"us-west-2"
        }
    },
    production: {
        DB:{
            HOST: "0.0.0.0",
            PORT: "27017",
            DATABASE: "test",
            MONGOOSE:{
                useUndifinedTopology: true,
                useNewUrlParser: true
            },
            UserName: "medtoolsystems",
            Password: "QFoyWLCUsdKlpIYr"
        },

        FRONTEND:{
            HOST:'https://medtool-frontend.vercel.app/',
            PORT:3000
        },
       


       
        PORTS: {
            API_PORT: 4001,
        },
        EMAIL: {
            host: "smtp.gmail.com",
            user: "medtoolsystems@gmail.com",
            password: "jxflzmgarmxuhddm",
        },
        cryptoSecret: "Cadence@08$08#2022",
        JWTSECRET: {
            JWT: "medtool@2023",
            EXPIRYTIME:"72h"
        },
        ENCRYPTION: {
            algorithm: "aes-256-cbc",
            iv: "Cadence@08$08#2022"
        },
        CRYPTOJS:{
            SECRETKEY:"medtool@2024"
        },
        AWS:{
            imagePrefix : "https://medtool-2024.s3.us-west-2.amazonaws.com/",
            AWS_accessKeyId:"AKIA5HWIAFCL3X44KN74",
            AWS_secretAccessKey:"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",
            AWS_region:"us-west-2"
        }
    }
}

module.exports.get = function get(env) {
    return config[env];
};