import { createElementWithClass, cleanUp } from '../utils/utils.js'

let cumulativeXP = 0;

export async function createSectionProfile() {

    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
  user {
    firstName
    lastName
    auditRatio
    transactions(where: { type: { _like: "skill_%" } }) {
      id
      type
      amount
    }
  }
  transaction(where : { _and : [{type : {_eq : "xp"}},
    {eventId : {_eq : 41}}
  ]}) {
    type
    amount
    path
    createdAt
    eventId
    object {
      type
      name
    }
}
}`
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        createProfilePage(data)
    }

}

function createProfilePage(data) {
  const sectionLogin = document.querySelector('.sectionLogin');
  cleanUp(sectionLogin);

  const container = createElementWithClass('div', 'profile-page');

  const header = createElementWithClass('header', 'profile-header');
  const name = createElementWithClass('span', 'user-name', 
    `Welcome, ${data.data.user[0].firstName} ${data.data.user[0].lastName} !`);
  const logoutButton = createElementWithClass('button', 'logout-btn', 'Log Out');
  logoutButton.addEventListener('click', handleLogout);

  header.appendChild(name);
  header.appendChild(logoutButton);
  container.appendChild(header);

  const content = createElementWithClass('div', 'profile-content');

  content.appendChild(createXPVisualization(data));
  content.appendChild(bestSkills(data.data.transaction));
  content.appendChild(totalXp());
  content.appendChild(auditRatio(data.data.user[0].auditRatio));

  container.appendChild(content);
  document.body.appendChild(container);

}

function bestSkills(data) {
  console.log(data);

  const emptyDiv = createElementWithClass('div', 'content-box');
  const titleDiv = createElementWithClass('div', 'title', 'Best Skills');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '100%');
  svg.setAttribute('width', '100%');
  svg.setAttribute('viewBox', '0 0 680 303');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('style', 'overflow: visible');

  emptyDiv.appendChild(titleDiv);
  emptyDiv.appendChild(svg);

  return emptyDiv;
}

function totalXp() {
  const emptyDiv = createElementWithClass('div', 'content-box');
  const titleDiv = createElementWithClass('div', 'title' , 'XP total');
  let xpText;

  if (cumulativeXP < 1000) {
    xpText = cumulativeXP + ' B';
  } else if (cumulativeXP < 1000000) {
    xpText = Math.round((cumulativeXP / 1000).toFixed(2)) + ' KB';
  } else {
    xpText =  Math.round((cumulativeXP / 1000000).toFixed(2)) + ' MB';
  }

  const xpDiv = createElementWithClass('div', 'content-xp', xpText);
  emptyDiv.appendChild(titleDiv);
  emptyDiv.appendChild(xpDiv);

  return emptyDiv;
}

function auditRatio(ratio) {
  const emptyDiv = createElementWithClass('div', 'content-box');
  const titleDiv = createElementWithClass('div', 'title', 'Audit Ratio');
  const ratioDiv = createElementWithClass('div', 'content-xp', customRound(ratio));

  emptyDiv.appendChild(titleDiv);
  emptyDiv.appendChild(ratioDiv);

  return emptyDiv;
}

function customRound(value) {
  const rounded = Math.round(value);
  if (value > rounded) {
    return (Math.round(value * 10) / 10).toFixed(1);
  }
  return rounded;
}

function createXPVisualization(transactionData) {

  const sortedData = transactionData.data.transaction.sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  const dataPoints = sortedData.map(transaction => {
    cumulativeXP += transaction.amount;
    return {
      date: new Date(transaction.createdAt),
      name: transaction.object.name,
      xp: cumulativeXP
    };
  });

  const startDate = dataPoints[0].date;
  const endDate = dataPoints[dataPoints.length - 1].date;
  const maxXP = dataPoints[dataPoints.length - 1].xp;

  const width = 680;
  const height = 303;
  const padding = 0;

  function scaleX(date) {
    const timeRange = endDate - startDate;
    const timePosition = date - startDate;
    return (timePosition / timeRange) * width;
  }

  function scaleY(xp) {
    return height - (xp / maxXP) * height;
  }

  const pathData = dataPoints.map((point, index) => {
    const x = scaleX(point.date);
    const y = scaleY(point.xp);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const emptyDiv = createElementWithClass('div', 'content-box');
  const titleDiv = createElementWithClass('div', 'title' , 'XP progression');
  emptyDiv.appendChild(titleDiv)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '100%');
  svg.setAttribute('width', '100%');
  svg.setAttribute('viewBox', `${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('style', 'overflow: visible');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', 'var(--color-action-hover)');
  path.setAttribute('fill', 'transparent');
  path.setAttribute('stroke-width', '2');

  dataPoints.forEach((point) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = scaleX(point.date);
    const y = scaleY(point.xp);
    
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', 'var(--color-action-hover)');
    
    circle.addEventListener('mouseover', (e) => {
      circle.setAttribute('r', '6');
      const tooltip = document.createElement('div', 'tooltip');
      tooltip.className = 'tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY - 10}px`;
      tooltip.style.color = 'white';
      tooltip.style.padding = '5px';
      tooltip.style.borderRadius = '3px';
      tooltip.style.fontSize = '12px';
      tooltip.style.zIndex = '10';
      
      tooltip.innerHTML = `
        Name: ${point.name}<br>
        Total XP: ${Math.round(point.xp).toLocaleString()}
      `;
      
      document.body.appendChild(tooltip);
      circle.addEventListener('mouseout', () => {
        circle.setAttribute('r', '4');
        tooltip.remove();
      });
    });

    svg.appendChild(circle);
  });

  svg.appendChild(path);
  emptyDiv.appendChild(svg);

  return emptyDiv;
}

function handleLogout() {
    localStorage.removeItem('jwt');
    alert('Logged out successfully!');
    location.reload();
}
