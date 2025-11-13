export const toggleFollow = async (req, res) => {
    const toBeFollowed = req.toBeFollowed //or toBeUnfollowed
    const follower = req.user
    const followerId = follower._id

    if (toBeFollowed.username == follower.username) return res.fail(400, "CANNOT_FOLLOW_SELF", "You cannot follow yourself")

    const index = toBeFollowed.followers.findIndex(e => e.toString() == followerId.toString())
    if (index == -1) {
        // Not following yet, follow now
        toBeFollowed.followers.push(followerId)
        toBeFollowed.followersCount++
        follower.following.push(toBeFollowed._id)
        follower.followingCount++
        await follower.save()
        await toBeFollowed.save()
        return res.success(200, "OK", `Now following: ${toBeFollowed.username}`)
    }
    else {
        // Alerady following, unfollow now
        toBeFollowed.followers.pull(followerId)
        toBeFollowed.followersCount--
        follower.following.pull(toBeFollowed._id)
        follower.followingCount--
        await follower.save()
        await toBeFollowed.save()
        return res.success(200, "OK", `Unfollowed: ${toBeFollowed.username}`)
    }

}
