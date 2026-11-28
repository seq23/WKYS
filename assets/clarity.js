// Microsoft Clarity loader, the one place its project id lives. build.mjs adds this file only to the
// home page and the landing pages (the pages with the inquiry form). It never runs on the signed-in
// apps (/founder, /client) or the portal demo, whose CSP stays strict. The form carries
// data-clarity-mask so typed answers are never recorded. If clarity.ms is blocked or down, nothing
// here throws: the page and the form work exactly the same.
const CLARITY_ID = 'zkli0tsyfh';
(() => {
  if (!CLARITY_ID || /^\/(founder|client|portal)(\.html)?\/?$/.test(location.pathname)) return;
  window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(CLARITY_ID);
  tag.onerror = () => {};
  document.head.appendChild(tag);
})();
