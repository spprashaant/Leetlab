import axios from "axios"

export const getJudge0LanguageId = (language) => {

    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63
    }
    const languageId = languageMap[language.toUpperCase()];

    return languageId || null;
}

export const submitBatch = async (submissions) => {
    console.log(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`)
    let response;
    try {
        response = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
            submissions
        })
    }
    catch (error) {
        console.log(error)
    }


    

    return response.data // [{token} , {token} , {token}]
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
    console.log("tokens: ", tokens)
    let response;
    while (true) {
        try {
            console.log(`${process.env.JUDGE0_API_URL}/submissions/batch`);

            response = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false,
                }
            })
        } catch (error) {
            console.log(error);
        }

        const results = response.data.submissions;
        console.log("results: ", results)
        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        )

        if (isAllDone) return results
        await sleep(1000)
    }
}

