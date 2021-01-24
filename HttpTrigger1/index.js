const Crypto = require('crypto');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Generate sha1 signature of req.body
    var defaultKey = process.env["GithubWebhookSecret"];
    const hmac = Crypto.createHmac("sha1", defaultKey);
    const signature = hmac.update(JSON.stringify(req.body)).digest('hex');
    const shaSignature = `sha1=${signature}`;

    // Compare signature to the one sent by GitHub
    const gitHubSignature = req.headers['x-hub-signature'];
    if (!shaSignature.localeCompare(gitHubSignature)) {
        // Evaluate the content of the request and process it
        if (req.body.pages[0].title){
            context.res = {
                body: "Page is " + req.body.pages[0].title + ", Action is " + req.body.pages[0].action + ", Event Type is " + req.headers['x-github-event']
            };
        }
        else {
            context.res = {
                status: 400,
                body: ("Invalid payload for Wiki event")
            }
        }
    }
    else {
        context.res = {
            status: 401,
            body: "Signatures don't match"
        };
    }
}