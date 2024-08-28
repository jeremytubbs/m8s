import slugify from "./slugify.js"

export default function buildJobDetailUrl(job) {
    return `/${slugify(job.location_exact)}/${job.title_slug}/${job.guid}/job/`
}
