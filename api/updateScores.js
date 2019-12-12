const superagent = require("superagent");

module.exports = async (req, res) => {
    try {
        console.log('j')
        const scores = await updateScores(req.query);
        res.json({
            scores: JSON.parse(scores)
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred");
    }
};

async function updateScores(query) {
    console.log("in");
    const result = await superagent
        .put(
            "https://api.github.com/repos/lauvrenn/arkanoid-private/contents/scores.json"
        )
        .set("Authorization", `token ${process.env.git_token}`)
        .set("User-Agent", "lauvrenn")
        .send({
            message: "update scores",
            committer: {
                name: "lauvrenn",
                email: "lauvrenn@gmail.com"
            },
            content: query
        })
        // .then(res => {
        //     console.log("response from github ", res.body.content);
        // })
        .catch(er => console.log("e", er));

    return Buffer.from(result.body.content, 'base64').toString();
}