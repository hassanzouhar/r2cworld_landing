// Function to parse Markdown with metadata and return the excerpt or full content
function parseMarkdownWithMetadata(mdContent, full = false) {
    const metadata = {};
    const mdLines = mdContent.split('\n');
    let content = '';
    let isExcerpt = true; // Track if we're within the excerpt
    
    for (let i = 0; i < mdLines.length; i++) {
        const line = mdLines[i].trim();
        
        // Parse metadata
        if (line.startsWith('title:')) metadata.title = line.replace('title:', '').trim();
        else if (line.startsWith('subtitle:')) metadata.subtitle = line.replace('subtitle:', '').trim();
        else if (line.startsWith('date:')) metadata.date = line.replace('date:', '').trim();
        else if (line.startsWith('hero-image:')) metadata.heroImage = line.replace('hero-image:', '').trim();
        else if (line.startsWith('status:')) metadata.status = line.replace('status:', '').trim();
        else if (line.startsWith('featured:')) metadata.featured = line.replace('featured:', '').trim();
        else if (line.startsWith('blogroll:')) metadata.blogroll = line.replace('blogroll:', '').trim();
        
        // Parse content, skipping metadata
        else if (line === '---') isExcerpt = false; // Stop the excerpt at `---`
        else if (isExcerpt || full) content += `${line}\n`;
    }
    
    return { metadata, content: marked.parse(content) };
}

// Function to load all blog posts as excerpts
async function loadBlogPosts() {
    const contentDiv = document.getElementById('content');
    try {
        const blogFiles = ['blog/firstpost.md', 'blog/anotherpost.md']; // Add paths to all blog files
        let blogHTML = '';
        
        for (const file of blogFiles) {
            const response = await fetch(file);
            if (!response.ok) continue;
            
            const mdContent = await response.text();
            const { metadata, content } = parseMarkdownWithMetadata(mdContent);
            
            // Only include published posts in the blogroll
            if (metadata.status === 'published' && metadata.blogroll === 'true') {
                blogHTML += `
                    <article>
                        <h2>${metadata.title}</h2>
                        <p><em>${metadata.subtitle}</em></p>
                        <div class="meta">${metadata.date}</div>
                        <div class="excerpt">${content}</div>
                        <a href="#" class="read-more" onclick="loadFullPost('${file}'); return false;">READ MORE</a>
                    </article>
                `;
            }
        }
        
        contentDiv.innerHTML = blogHTML || '<p>No blog posts found.</p>';
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load blog posts. Please try again later.</p></article>`;
        console.error(error);
    }
}

// Function to load the full blog post
async function loadFullPost(mdFile) {
    const contentDiv = document.getElementById('content');
    try {
        const response = await fetch(mdFile);
        if (!response.ok) throw new Error('Markdown file not found');
        
        const mdContent = await response.text();
        const { metadata, content } = parseMarkdownWithMetadata(mdContent, true); // Load full content
        
        contentDiv.innerHTML = `
            <article>
                <h1>${metadata.title}</h1>
                <p><em>${metadata.subtitle}</em></p>
                <div class="meta">${metadata.date}</div>
                ${metadata.heroImage ? `<img src="${metadata.heroImage}" alt="${metadata.title}">` : ''}
                <div class="full-content">${content}</div>
                <a href="#" onclick="loadBlogPosts(); return false;" class="back-to-blog">Back to Blog</a>
            </article>
        `;
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load the blog post. Please try again later.</p></article>`;
        console.error(error);
    }
}

// Function to load content into a specific box
async function loadContentIntoBox(mdFile, boxId, moreLink) {
    const box = document.getElementById(boxId);
    try {
        const response = await fetch(mdFile);
        if (!response.ok) throw new Error(`Failed to fetch ${mdFile}`);
        const mdContent = await response.text();
        box.innerHTML = `
            ${marked.parse(mdContent)}
            <a href="${moreLink}" class="read-more">READ MORE</a>
        `;
    } catch (error) {
        box.innerHTML = `<p>Error loading content from ${mdFile}. Please try again later.</p>`;
        console.error(error);
    }
}

// Function to load all homepage sections
function loadHomepageSections() {
    loadContentIntoBox('pages/home.md', 'home-box', '/about');
    loadContentIntoBox('pages/about.md', 'about-box', '/projects');
    loadContentIntoBox('pages/projects.md', 'projects-box', '/contact');
    loadContentIntoBox('pages/contact.md', 'contact-box', '/contact');
}

// Load homepage sections on page load
window.onload = loadHomepageSections;