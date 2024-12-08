// Reusable function to fetch and parse Markdown content
async function fetchMarkdown(mdFile) {
    try {
        const response = await fetch(mdFile);
        if (!response.ok) throw new Error(`Failed to fetch ${mdFile}: ${response.statusText}`);
        const mdContent = await response.text();
        return mdContent; // Return raw Markdown for processing
    } catch (error) {
        console.error(`Error fetching Markdown file: ${mdFile}`, error);
        return null;
    }
}

// Function to parse Markdown with metadata
function parseMarkdownWithMetadata(mdContent, full = false) {
    const metadata = {};
    const mdLines = mdContent.split('\n');
    let content = '';
    let isExcerpt = true;

    for (const line of mdLines) {
        if (line.startsWith('title:')) metadata.title = line.replace('title:', '').trim();
        else if (line.startsWith('subtitle:')) metadata.subtitle = line.replace('subtitle:', '').trim();
        else if (line.startsWith('date:')) metadata.date = line.replace('date:', '').trim();
        else if (line.startsWith('hero-image:')) metadata.heroImage = line.replace('hero-image:', '').trim();
        else if (line.startsWith('status:')) metadata.status = line.replace('status:', '').trim();
        else if (line.startsWith('featured:')) metadata.featured = line.replace('featured:', '').trim();
        else if (line.startsWith('blogroll:')) metadata.blogroll = line.replace('blogroll:', '').trim();
        else if (line === '---') isExcerpt = false;
        else if (isExcerpt || full) content += `${line}\n`;
    }

    return { metadata, html: marked.parse(content) };
}

// Function to load homepage content (pages + blog posts)
async function loadHomepage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content

    const pageFiles = ['pages/home.md', 'pages/about.md', 'pages/projects.md', 'pages/contact.md'];
    const blogFiles = ['blog/firstpost.md', 'blog/anotherpost.md'];

    // Load pages
    for (const file of pageFiles) {
        const mdContent = await fetchMarkdown(file);
        if (mdContent) {
            const { metadata, html } = parseMarkdownWithMetadata(mdContent);
            contentDiv.innerHTML += `
                <div class="content-box">
                    <h2>${metadata.title || 'Untitled'}</h2>
                    ${html}
                </div>
            `;
        }
    }

    // Load blog posts
    for (const file of blogFiles) {
        const mdContent = await fetchMarkdown(file);
        if (mdContent) {
            const { metadata, html } = parseMarkdownWithMetadata(mdContent);
            if (metadata.status === 'published' && metadata.blogroll === 'true') {
                contentDiv.innerHTML += `
                    <div class="content-box">
                        <h2>${metadata.title || 'Untitled'}</h2>
                        <p>${metadata.subtitle || ''}</p>
                        <p>${metadata.date || ''}</p>
                        ${html}
                        <a href="#" class="button read-more" onclick="loadFullPost('${file}'); return false;">READ MORE</a>
                    </div>
                `;
            }
        }
    }
}

// Function to load blog page (blog posts only)
async function loadBlogPage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content

    const blogFiles = ['blog/firstpost.md', 'blog/anotherpost.md'];

    for (const file of blogFiles) {
        const mdContent = await fetchMarkdown(file);
        if (mdContent) {
            const { metadata, html } = parseMarkdownWithMetadata(mdContent);
            if (metadata.status === 'published') {
                contentDiv.innerHTML += `
                    <div class="content-box">
                        <h2>${metadata.title || 'Untitled'}</h2>
                        <p>${metadata.subtitle || ''}</p>
                        <p>${metadata.date || ''}</p>
                        ${html}
                        <a href="#" class="button read-more" onclick="loadFullPost('${file}'); return false;">READ MORE</a>
                    </div>
                `;
            }
        }
    }
}

// Function to load a full blog post
async function loadFullPost(mdFile) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content

    const mdContent = await fetchMarkdown(mdFile);
    if (mdContent) {
        const { metadata, html } = parseMarkdownWithMetadata(mdContent, true);
        contentDiv.innerHTML = `
            <article>
                <h1>${metadata.title || 'Untitled'}</h1>
                <p><em>${metadata.subtitle || ''}</em></p>
                <div class="meta">${metadata.date || ''}</div>
                ${metadata.heroImage ? `<img src="${metadata.heroImage}" alt="${metadata.title}">` : ''}
                <div>${html}</div>
                <a href="#" class="button back-to-blog" onclick="loadBlogPage(); return false;">Back to Blog</a>
            </article>
        `;
    }
}

// Function to clear the main content container
function clearContent() {
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
        contentDiv.innerHTML = ''; // Clear existing content
    }
}

// Load homepage on page load
window.onload = loadHomepage;