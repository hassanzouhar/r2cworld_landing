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
            const { html, metadata } = parseMarkdownWithMetadata(mdContent);
            blogHTML += `
                <article>
                    <h2>${metadata.title}</h2>
                    <div class="meta">
                        <span>${metadata.date}</span>
                        <span>${metadata.subtitle}</span>
                    </div>
                    ${html}
                </article>
            `;
        }
        contentDiv.innerHTML = blogHTML || '<p>No blog posts found.</p>';
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load blog posts. Please try again later.</p></article>`;
        console.error(error);
    }
}

// Parse Markdown with metadata
function parseMarkdownWithMetadata(mdContent) {
    const metadata = {};
    const mdLines = mdContent.split('\n');
    let html = '';

    for (let i = 0; i < mdLines.length; i++) {
        const line = mdLines[i].trim();
        if (line.startsWith('title:')) {
            metadata.title = line.replace('title:', '').trim();
        } else if (line.startsWith('subtitle:')) {
            metadata.subtitle = line.replace('subtitle:', '').trim();
        } else if (line.startsWith('date:')) {
            metadata.date = line.replace('date:', '').trim();
        } else {
            html += `${line}\n`;
        }
    }

    return { html: marked.parse(html), metadata };
}