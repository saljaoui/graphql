import { createElementWithClass, cleanUp } from '../utils/utils.js'

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
function createXPVisualization(transactionData) {
  // Sort transactions by date
  const sortedData = transactionData.data.transaction.sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Calculate cumulative XP
  let cumulativeXP = 0;
  const dataPoints = sortedData.map(transaction => {
    cumulativeXP += transaction.amount;
    return {
      date: new Date(transaction.createdAt),
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
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '100%');
  svg.setAttribute('width', '100%');
  svg.setAttribute('viewBox', `${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('style', 'overflow: visible');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', 'red');
  path.setAttribute('fill', 'transparent');
  path.setAttribute('stroke-width', '2');

  dataPoints.forEach((point) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = scaleX(point.date);
    const y = scaleY(point.xp);
    
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', 'red');
    
    circle.addEventListener('mouseover', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY - 10}px`;
      tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '5px';
      tooltip.style.borderRadius = '3px';
      tooltip.style.fontSize = '12px';
      tooltip.style.zIndex = '1000';
      tooltip.innerHTML = `
        Date: ${point.name.toLocaleDateString()}<br>
        Total XP: ${Math.round(point.xp).toLocaleString()}
      `;
      document.body.appendChild(tooltip);
      
      circle.addEventListener('mouseout', () => {
        tooltip.remove();
      });
    });
    
    svg.appendChild(circle);
  });

  svg.appendChild(path);
  emptyDiv.appendChild(svg);

  return emptyDiv;
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

    for (let i = 0; i < 3; i++) {
        const emptyDiv = createElementWithClass('div', 'content-box', `Content Box ${i + 1}`);
        content.appendChild(emptyDiv);
    }

    container.appendChild(content);
    document.body.appendChild(container);
}

function handleLogout() {
    localStorage.removeItem('jwt');
    alert('Logged out successfully!');
    location.reload();
}
