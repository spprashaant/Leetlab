export const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;

        const submission = await db.submission.findMany({
            where: {
                userId: userId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
}

export const getAllSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;
        const submissions = await db.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
}

export const getSubmissionCountForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const submission = await db.submission.count({
            where: {
                problemId: problemId
            }
        });
        res.status(200).json({
            success: true,
            message: "Submission count fetched successfully",
            count: submission
        });
    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions count" });
    }
}