/**
 * Compute the build url for the current microsite, only callable during a build/dev server.
 *
 * @return {String} The origin url for the current microsite.
 */
export function getBuildUrl() {
    const folder = path.basename(process.cwd())
    const branch = trim(exec("git", "rev-parse --abbrev-ref HEAD", {returnOutput: true}).toString())
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()

    return `https://${branch}--${folder}.microsites.recruitrooster.com`
}
