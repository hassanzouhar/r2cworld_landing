// Function to load and display Markdown content
async function loadPage(mdFile) {
    const contentDiv = document.getElementById('content');
    try {
        const response = await fetch(mdFile);
        if (!response.ok) throw new Error('Markdown file not found');
        const mdContent = await response.text();
        contentDiv.innerHTML = marked.parse(mdContent);
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load content. Please try again later.</p></article>`;
        console.error(error);
    }
}

// Function to load all blog posts dynamically
async function loadBlogPosts() {
    const contentDiv = document.getElementById('content');
    try {
        const blogFiles = ['blog/firstpost.md', 'blog/anotherpost.md'];
        let blogHTML = '';
        for (const file of blogFiles) {
            const response = await fetch(file);
            if (!response.ok) continue;
            const mdContent = await response.text();
            blogHTML += `<article>${marked.parse(mdContent)}</article>`;
        }
        contentDiv.innerHTML = blogHTML || '<p>No blog posts found.</p>';
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load blog posts. Please try again later.</p></article>`;
        console.error(error);
    }
}

// Automatically load home page content on page load
window.onload = () => loadPage('pages/home.md');