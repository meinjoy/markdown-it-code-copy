
const _ = require('lodash');
try {
	// Node js will throw an error
	this === window;

	const Clipboard = require('clipboard');
	var clipboard = new Clipboard('.markdown-it-code-copy');

	clipboard.on('success', function (e) {
		var element = e.trigger;// 获取触发剪贴板操作的元素
		var icon = element.querySelector('#copy-id');
		if (icon) {
			icon.className = 'mdi mdi-check';
			icon.textContent = ' copied';
			setTimeout(function() {
				icon.className = 'mdi mdi-content-copy';
				icon.textContent = '';
			}, 3000);
		}
		e.clearSelection();
	});

	clipboard.on('error', function (e) {
		console.error('Action:', e.action);
		console.error('Trigger:', e.text);
	});
}
catch (_err) {
}

const defaultOptions = {
	iconStyle: 'font-size: 18px; opacity: 0.6; color:white;',
	iconClass: 'mdi mdi-content-copy',
	buttonStyle: 'position: absolute; top: 7.5px; right: 6px; cursor: pointer; outline: none;',
	buttonClass: ''
};

function renderCode(origRule, options) {
	options = _.merge(defaultOptions, options);
	return (...args) => {
		const [tokens, idx] = args;
		const content = tokens[idx].content
			.replaceAll('"', '&quot;')
			.replaceAll("'", "&apos;");
		const origRendered = origRule(...args);

		if (content.length === 0)
			return origRendered;

		return `
<div style="position: relative">
	${origRendered}
	<span class="markdown-it-code-copy ${options.buttonClass}" data-clipboard-text="${content}" style="${options.buttonStyle}" title="Copy">
		<span id="copy-id" style="${options.iconStyle}" class="${options.iconClass}"></span>
	</span>
</div>
`;
	};
}

module.exports = (md, options) => {
	md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block, options);
	md.renderer.rules.fence = renderCode(md.renderer.rules.fence, options);
};
