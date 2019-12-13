const superagent = require("superagent");

module.exports = async (req, res) => {
    try {
        console.log('cookies ', req.cookies)
        console.log('query ', req.query)
        console.log('body ', req.body)
        console.log('body ', req.body.stringifiedData)
        console.log('converted ', JSON.parse(JSON.stringify(req.body)))
        console.log('converted ', JSON.parse(JSON.stringify(req.body)).stringifiedData)

        const content = req.body.stringifiedData
        const sha = req.body.sha

        if (content && sha) {
            const bufferedData = Buffer.from(content).toString("base64");
            const response = await updateScores(bufferedData, sha);
            if (response.ok) {
                res.status(200).send("File updated")
            } else {
                throw 'An error occured during update'
            }
        } else {
            throw 'No scores content received'
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
};

async function updateScores(content, sha) {
    console.log("update received ", content);
    console.log("sending ", {
        message: "update scores",
        committer: {
            name: "lauvrenn",
            email: "lauvrenn@gmail.com"
        },
        content: content,
        sha: sha
    })
    const result = await superagent
        .put(
            "https://api.github.com/repos/lauvrenn/scores/contents/scores.json"
        )
        .set("Authorization", `token ${process.env.git_token}`)
        .set("User-Agent", "lauvrenn")
        .send({
            message: "update scores",
            committer: {
                name: "scoresbot",
                email: "scoresgithubbot@gmail.com"
            },
            content: content,
            sha: sha
        })
        .catch(er => console.log("e", er));

    console.log('received from github ', result.body)
    console.log('received from github result ', result)

    return result
}