const superagent = require("superagent");

module.exports = async (req, res) => {
    try {
        console.log("j");
        const {
            scores,
            sha
        } = await getScores();
        console.log("scores server ", scores);
        console.log("sha server ", sha);
        res.json({
            scores: JSON.parse(scores),
            sha: sha
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred");
    }
};

async function getScores() {
    console.log("in");
    const result = await superagent
        .get("https://api.github.com/repos/lauvrenn/scores/contents/scores.json")
        .set("Authorization", `token ${process.env.git_token}`)
        .set("User-Agent", "lauvrenn")
        .catch(er => console.log("e", er));

    return {
        scores: Buffer.from(result.body.content, "base64").toString(),
        sha: result.body.sha
    };
}