const request = require("request-promise");
const crypto = require("crypto");
const base64url = require("base64url");
const querystring = require("querystring");

const baseUrl = "https://oauth.reddit.com";

function gen_token() {
    return base64url(crypto.randomBytes(25));
}

module.exports = class Reddit {
    constructor(CLIENT_ID, CLIENT_SECRET) {
        this.id = CLIENT_ID;
        this.secret = CLIENT_SECRET;
    }

    auth() {
        let device_id = gen_token();
        let params = {
            client_id: this.id,
            response_type: "code",
            state: device_id,
            duration: "permanent",
            redirect_uri: "http://localhost:8000",
            grant_type: `https://oauth.reddit.com/grants/installed_client&\
            device_id=${device_id}`,
            scope: "identity"
        };
        request
            .post({
                uri: "https://www.reddit.com/api/v1/access_token",
                auth: {
                    user: this.id,
                    password: this.secret
                },
                body: querystring.stringify({
                    grant_type: "client_credentials"
                })
            })
            .then(res => {
                res = JSON.parse(res);
                this.token = res.access_token;
                console.log(this.token);
                this.hot();
            });
    }

    hot() {
        let options = {
            uri: baseUrl + "/hot",
            method: "GET",
            headers: {
                Authorization: "bearer " + this.token,
                "User-Agent": "script:reddit-wrapper:v0.1 (by /u/danbrk)"
            }
        };
        request(options).then(res => {
            console.log(JSON.stringify(res));
        });
    }
};