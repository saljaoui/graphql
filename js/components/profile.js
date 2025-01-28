

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
                    id
                    login
                }
            }`
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        
    }

}
