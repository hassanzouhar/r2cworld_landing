// Reusable function to fetch and parse Markdown content
async function fetchMarkdown(mdFile) {
    try {
        const response = await fetch(mdFile);
        if (!response.ok) throw new Error(`Failed to fetch ${mdFile}: ${response.statusText}`);
        const mdContent = await response.text();
        return marked.parse(mdContent); // Parsed HTML content
    } catch (error) {
        console.error(`Error fetching Markdown file: ${mdFile}`, error);
        return `<article><h2>Error</h2><p>Could not load content. Please try again later.</p></article>`;
    }
}

// Function to load and display Markdown content into a container
async function loadPage(mdFile, containerId = 'content') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }
    const htmlContent = await fetchMarkdown(mdFile);
    container.innerHTML = htmlContent;
}

// Function to parse Markdown with metadata
function parseMarkdownWithMetadata(mdContent) {
    const metadata = {};
    const mdLines = mdContent.split('\n');
    let content = '';

    for (const line of mdLines) {
        if (line.startsWith('title:')) {
            metadata.title = line.replace('title:', '').trim();
        } else if (line.startsWith('subtitle:')) {
            metadata.subtitle = line.replace('subtitle:', '').trim();
        } else if (line.startsWith('date:')) {
            metadata.date = line.replace('date:', '').trim();
        } else {
            content += `${line}\n`;
        }
    }

    return { html: marked.parse(content), metadata };
}

// Function to load all blog posts dynamically
async function loadBlogPosts() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error(`Container with ID "content" not found`);
        return;
    }

    const blogFiles = ['blog/firstpost.md', 'blog/anotherpost.md'];
    try {
        // Fetch all blog files in parallel
        const blogResponses = await Promise.all(
            blogFiles.map((file) => fetch(file).then((res) => res.ok ? res.text() : null))
        );

        const blogHTML = blogResponses
            .filter((mdContent) => mdContent !== null)
            .map((mdContent) => {
                const { html, metadata } = parseMarkdownWithMetadata(mdContent);
                return `
                    <article>
                        <h2>${metadata.title || 'Untitled'}</h2>
                        <div class="meta">
                            <span>${metadata.date || 'Unknown Date'}</span>
                            <span>${metadata.subtitle || ''}</span>
                        </div>
                        ${html}
                    </article>
                `;
            })
            .join('');

        contentDiv.innerHTML = blogHTML || '<p>No blog posts found.</p>';
    } catch (error) {
        contentDiv.innerHTML = `<article><h2>Error</h2><p>Could not load blog posts. Please try again later.</p></article>`;
        console.error('Error loading blog posts:', error);
    }
}

// Function to load content into specific boxes dynamically
async function loadContentIntoBox(mdFile, boxId) {
    const box = document.getElementById(boxId);
    if (!box) {
        console.error(`Box with ID "${boxId}" not found`);
        return;
    }
    const htmlContent = await fetchMarkdown(mdFile);
    box.innerHTML = htmlContent;
}

// Function to load all sections for the homepage
async function loadHomepageSections() {
    const sections = [
        { file: 'pages/home.md', boxId: 'home-box' },
        { file: 'pages/about.md', boxId: 'about-box' },
        { file: 'pages/projects.md', boxId: 'projects-box' },
        { file: 'pages/contact.md', boxId: 'contact-box' },
    ];

    // Load all sections in parallel
    await Promise.all(
        sections.map(({ file, boxId }) => loadContentIntoBox(file, boxId))
    );
}

// Function to scroll smoothly to a section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error(`Section with ID "${sectionId}" not found`);
    }
}

// Load all homepage sections on page load
window.onload = loadHomepageSections;