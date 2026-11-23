function enhanceParentGuide(guide) {
  const topics = Array.from(guide.querySelectorAll(':scope > details'));
  if (!topics.length) return;

  const tabList = document.createElement('div');
  tabList.className = 'guide-tabs';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Θέματα για γονείς');

  const pageList = document.createElement('div');
  pageList.className = 'guide-pages';

  const tabs = [];
  const panels = [];
  let selectedTopic = -1;
  for (const [index, topic] of topics.entries()) {
    const title = topic.querySelector('summary').textContent.trim();
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'guide-tab';
    tab.id = `parent-guide-tab-${index + 1}`;
    tab.textContent = title;
    tab.setAttribute('role', 'tab');

    const panel = document.createElement('div');
    panel.className = 'guide-page';
    panel.id = `parent-guide-page-${index + 1}`;
    panel.tabIndex = 0;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.setAttribute('aria-controls', panel.id);

    const heading = document.createElement('h3');
    heading.textContent = title;
    panel.append(heading, topic.querySelector('p').cloneNode(true));

    tab.addEventListener('click', () => selectTopic(index));
    tabList.append(tab);
    pageList.append(panel);
    tabs.push(tab);
    panels.push(panel);
  }

  const pager = document.createElement('div');
  pager.className = 'guide-pager';
  pager.setAttribute('role', 'group');
  pager.setAttribute('aria-label', 'Πλοήγηση στα θέματα για γονείς');

  const previousTopic = document.createElement('button');
  previousTopic.type = 'button';
  previousTopic.textContent = 'Προηγούμενο';
  previousTopic.setAttribute('aria-label', 'Προηγούμενο θέμα');
  previousTopic.addEventListener('click', () => selectTopic((selectedTopic + tabs.length - 1) % tabs.length));

  const progress = document.createElement('span');
  progress.className = 'guide-progress';

  const nextTopic = document.createElement('button');
  nextTopic.type = 'button';
  nextTopic.textContent = 'Επόμενο';
  nextTopic.setAttribute('aria-label', 'Επόμενο θέμα');
  nextTopic.addEventListener('click', () => selectTopic((selectedTopic + 1) % tabs.length));

  const announcement = document.createElement('span');
  announcement.className = 'guide-announcement';
  announcement.setAttribute('role', 'status');
  pager.append(previousTopic, progress, nextTopic, announcement);

  function selectTopic(index) {
    if (selectedTopic === index) return;
    selectedTopic = index;
    for (const [position, tab] of tabs.entries()) {
      const selected = position === index;
      tab.tabIndex = selected ? 0 : -1;
      tab.setAttribute('aria-selected', String(selected));
      panels[position].hidden = !selected;
    }
    const position = `${index + 1} από ${tabs.length}`;
    progress.textContent = position;
    announcement.textContent = `${tabs[index].textContent}. ${position}.`;
  }

  tabList.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(event.target);
    if (current < 0) return;

    let next;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current + tabs.length - 1) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectTopic(next);
    tabs[next].focus();
  });

  const initiallyOpenTopic = topics.findIndex((topic) => topic.open);
  selectTopic(Math.max(0, initiallyOpenTopic));
  guide.replaceChildren(tabList, pageList, pager);
  guide.classList.add('is-enhanced');
}

const parentGuide = document.querySelector('.parent-guide');
if (parentGuide) enhanceParentGuide(parentGuide);
