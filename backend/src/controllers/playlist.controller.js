import { db } from "../libs/db.js";

export const createPlayList = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;
        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        });
        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        })
    } catch (error) {
        console.log("Error creating playlist:", error);
        return res.status(500).json({
            error: "Failed to create playlist"
        });
    }
}

export const getAllListDetails = async (req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlists
        })
    } catch (error) {
        console.log("Error fetching playlist:", error);
        return res.status(500).json({
            error: "Failed to fetch playlist"
        });
    }
}

export const getPlayListDetails = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" })
        }
        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist
        })
    } catch (error) {
        console.log("Error fetching playlist:", error);
        return res.status(500).json({
            error: "Failed to fetch playlist"
        });
    }
}

export const addProblemToPlayList = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemIds" });
        }

        // Create records for each problem in playlist
        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId
            }))
        });

        res.status(201).json({
            success: true,
            message: "Problems added to Playlist successfully",
            problemsInPlaylist
        })
    } catch (error) {
        console.log("Error adding problems to playlist:", error);
        return res.status(500).json({
            error: "Failed to add problems to playlist"
        });
    }
}

export const deletePlayList = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId
            }
        });
        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist
        })
    } catch (error) {
        console.log("Error deleting playlist:", error);
        return res.status(500).json({
            error: "Failed to delete playlist"
        });
    }
}

export const removeProblemFromPlayList = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemIds" });
        }
        const deletedProblems = await db.problemsInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "Deleted problems from Playlist",
            deletedProblems
        })
    } catch (error) {
        console.log("Error deleting problems in playlist:", error);
        return res.status(500).json({
            error: "Failed to delete problems in playlist"
        });
    }
}