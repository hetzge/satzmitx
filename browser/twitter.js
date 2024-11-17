console.log("Hello SatzMitX twitter script")

const blueskyImageSrc = browser.runtime.getURL("icons/bluesky.png")

function createBlueskyIcon() {
	const img = document.createElement("img")
	img.src = blueskyImageSrc
	img.style.width = "10px"
	img.style.height = "10px"
	img.style.paddingLeft = "4px"
	return img
}

function createOnClickCallback(key) {
	return (event) => {
		if (key.startsWith("#")) {
			// https://mastodon.social/tags/ThrowbackThursday
			location.href = "https://bsky.app/hashtag/" + key.substring(1)
		} else {
			location.href = "https://bsky.app/search?q=" + key
		}
		event.preventDefault()
		event.stopPropagation()
	}
}

function process() {
	for (const element of document.querySelectorAll("[data-testid='trend']")) {
		if (element.hasAttribute("data-satzmitx-processed")) { continue }
		element.setAttribute("data-satzmitx-processed", true)
		const trendRankingElement = element.querySelector(":scope > div:nth-child(1)>div:nth-child(1)")
		const trendKeyElement = element.querySelector(":scope > div:nth-child(1)>div:nth-child(2)")
		const trendStatisticsElement = element.querySelector(":scope > div:nth-child(1)>div:nth-child(3)")
		const onclick = createOnClickCallback(trendKeyElement.textContent)
		trendRankingElement.onclick = onclick
		trendKeyElement.onclick = onclick
		trendStatisticsElement.onclick = onclick
		trendKeyElement.append(createBlueskyIcon())
	}
	for (const element of document.querySelectorAll("a[role='link']")) {
		console.log(element, element.href)
		if (!element.href.includes("/hashtag/")) { continue }
		if (element.hasAttribute("data-satzmitx-processed")) { continue }
		element.setAttribute("data-satzmitx-processed", true)
		element.onclick = createOnClickCallback(element.textContent)
		element.appendChild(createBlueskyIcon())
	}
}
new MutationObserver(() => process())
	.observe(document.documentElement, {
		childList: true,
		subtree: true,
		attributeFilter: [
			"[data-testid='trend']",
			"[role='link']"
		]
	})
process()


