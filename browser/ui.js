import * as core from "./core.js"

function createLink(href, text) {
	var link = document.createElement("a")
	link.href = href
	link.textContent = text
	return link
}

/**
 * @param {core.Finding} finding
 */
function createRow(finding) {
	var row = document.createElement("tr")
	var timeCell = document.createElement("td")
	var sourceCell = document.createElement("td")
	var targetCell = document.createElement("td")

	timeCell.textContent = new Date(finding.timestamp).toUTCString()
	sourceCell.appendChild(createLink(finding.source, finding.source))
	targetCell.appendChild(createLink(`https://bsky.app/profile/${finding.account.substring(1)}`, finding.account))

	row.appendChild(timeCell)
	row.appendChild(sourceCell)
	row.appendChild(targetCell)
	return row
}

console.log(core)
console.log(core.loadSortAndCleanupFindings())


function update() {
	document.querySelector("tbody").innerHTML = ""
	for (const finding of core.loadSortAndCleanupFindings()) {
		document.querySelector("tbody").appendChild(createRow(finding))
	}
}

document.getElementById("clear-button").addEventListener("click", function() {
	core.clearFindings()
	update()
})

browser.runtime.onMessage.addListener(async (message) => {
	if (message.key === "UPDATED_FINDINGS") {
		update()
	}
})

update()




