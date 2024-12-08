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

// Function to load all blog posts dynamically
async function loadBlogPosts() {
    clearContent();
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error(`Container with ID "content" not found`);
        return;
    }

    const blogFiles = ['blog/firstpost.md', 'blog/anotherpost.md'];
    try {
        const blogHTML = await Promise.all(
            blogFiles.map(async (file) => {
                const mdContent = await fetchMarkdown(file);
                if (!mdContent) return '';
                const { metadata, html } = parseMarkdownWithMetadata(mdContent);
                if (metadata.status !== 'published' || metadata.blogroll !== 'true') return '';
                return `
                    <article>
                        <h2>${metadata.title || 'Untitled'}</h2>
                        <p><em>${metadata.subtitle || ''}</em></p>
                        <div class="meta">${metadata.date || 'Unknown Date'}</div>
                        <div class="excerpt">${html}</div>
                        <a href="#" class="read-more" onclick="loadFullPost('${file}'); return false;">READ MORE</a>
                    </article>
                `;
            })
        );

        contentDiv.innerHTML = blogHTML.filter(Boolean).join('') || '<p>No blog posts found.</p>';
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load blog posts. Please try again later.</p></article>`;
        console.error('Error loading blog posts:', error);
    }
}

// Function to load a full blog post
async function loadFullPost(mdFile) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error(`Container with ID "content" not found`);
        return;
    }

    try {
        const mdContent = await fetchMarkdown(mdFile);
        if (!mdContent) throw new Error('Markdown content not found');
        const { metadata, html } = parseMarkdownWithMetadata(mdContent, true);
        contentDiv.innerHTML = `
            <article>
                <h1>${metadata.title || 'Untitled'}</h1>
                <p><em>${metadata.subtitle || ''}</em></p>
                <div class="meta">${metadata.date || 'Unknown Date'}</div>
                ${metadata.heroImage ? `<img src="${metadata.heroImage}" alt="${metadata.title}">` : ''}
                <div class="full-content">${html}</div>
                <a href="#" onclick="loadBlogPosts(); return false;" class="back-to-blog">Back to Blog</a>
            </article>
        `;
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load the blog post. Please try again later.</p></article>`;
        console.error('Error loading full blog post:', error);
    }
}

// Function to clear the main content container
function clearContent() {
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
        contentDiv.innerHTML = ''; // Clear existing content
    }
}

// Function to ensure a container exists or create it dynamically
function ensureContainerExists(containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'content-box';
        document.getElementById('content').appendChild(container);
    }
    return container;
}

// Function to load content into specific boxes dynamically
async function loadContentIntoBox(mdFile, boxId) {
    const box = ensureContainerExists(boxId);
    const mdContent = await fetchMarkdown(mdFile);
    if (mdContent) {
        const { html } = parseMarkdownWithMetadata(mdContent, true);
        box.innerHTML = html;
    }
}

// Function to load all sections for the homepage
async function loadHomepageSections() {
    clearContent();
    const sections = [
        { file: 'pages/home.md', boxId: 'home-box' },
        { file: 'pages/about.md', boxId: 'about-box' },
        { file: 'pages/projects.md', boxId: 'projects-box' },
        { file: 'pages/contact.md', boxId: 'contact-box' },
    ];

    await Promise.all(
        sections.map(({ file, boxId }) => loadContentIntoBox(file, boxId))
    );
}

// Load homepage sections on page load
window.onload = loadHomepageSections;