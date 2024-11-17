/**
 * Service enum
 * @readonly
 * @enum {string}
 */
const ServiceEnum = {
	BLUESKY: "BLUESKY",
	MASTODON: "MASTODON"
}

/**
 * @typedef Finding
 * @type {object}
 * @property {string} source - url of the source page
 * @property {number} timestamp - timestamp of the finding
 * @property {ServiceEnum} service - key of the service (as example 'MASTODON', 'BLUESKY')
 * @property {string} account - the account name in the specific service
 */
{ }

const FINDINGS_LOCAL_STORAGE_KEY = "findings"

/**
 * @param {Finding} finding 
 */
export function addFindings(findings) {
	const findingByAccount = loadFindingByAccount()
	for (const finding of findings) {
		findingByAccount[finding.account] = finding
	}
	localStorage.setItem(FINDINGS_LOCAL_STORAGE_KEY, JSON.stringify(findingByAccount))
	console.log("Stored findings: ", findingByAccount)
}

/**
 * @returns {Object.<string, Finding>}
 */
export function loadFindingByAccount() {
	return JSON.parse(localStorage.getItem(FINDINGS_LOCAL_STORAGE_KEY)) || {}
}

/**
 * @returns {Finding[]}
 */
export function loadSortAndCleanupFindings() {
	const findingByAccount = loadFindingByAccount()
	const findings = Object.keys(findingByAccount).map(key => findingByAccount[key])
	findings.sort((a, b) => b.timestamp - a.timestamp)
	if (findings.length > 1000) {
		for (let i = 1000; i < findings.length; i++) {
			delete findingByAccount[findings[i].account]
		}
		localStorage.setItem(FINDINGS_LOCAL_STORAGE_KEY, JSON.stringify(findingByAccount))
		findings.length = 1000
	}
	return findings
}

export function clearFindings() {
	localStorage.setItem(FINDINGS_LOCAL_STORAGE_KEY, JSON.stringify({}))
}