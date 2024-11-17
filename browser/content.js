console.log("Hello SatzMitX content script")

const settings = {
	onlyMe: false
}

const processedHrefs = new Set()

function isBlueskyProfileUrl(href) {
	return href.startsWith("https://bsky.app/profile/")
}

function getBlueskyProfileNameFromUrl(href) {
	const url = new URL(href)
	const lastIndexOf = url.pathname.lastIndexOf("/")
	if (lastIndexOf === -1) {
		return null
	}
	if (lastIndexOf + 1 >= href.length) {
		return null
	}
	return "@" + url.pathname.substring(lastIndexOf + 1)
}

function process() {
	const url = window.location.toString()
	if(url.startsWith("https://bsky.app/")) {
		return
	}
	const elements = document.querySelectorAll(":is(link, a)")
	const hrefs = Array.from(elements)
		.filter(element => !settings.onlyMe || element.getAttribute("rel") === 'me')
		.map(element => element.getAttribute("href"))
		.filter(href => href !== null)
		.filter(href => isBlueskyProfileUrl(href))
		.filter(href => !processedHrefs.has(href))
		.filter(href => getBlueskyProfileNameFromUrl(href) !== null)
	if (hrefs.length > 0) {
		console.log("Found " + hrefs.length + " findings")
		for (const href of hrefs) {
			processedHrefs.add(href)
		}
		browser.runtime.sendMessage({
			key: "FOUND_FINDINGS",
			findings: hrefs.map(href => ({
				timestamp: new Date().getTime(),
				account: getBlueskyProfileNameFromUrl(href),
				source: url,
				service: "BLUESKY"
			}))
		})
	}
}

new MutationObserver(() => process())
	.observe(document.documentElement, {
		childList: true,
		subtree: true
	});

process()