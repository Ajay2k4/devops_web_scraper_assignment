const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  console.log("Starting scraper");

  try {
    // Read target URL from environment variable
    const url = process.env.SCRAPE_URL || "https://en.wikipedia.org/wiki/Artificial_intelligence";
    console.log("Target URL:", url);

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Open the webpage
    console.log("Opening webpage");
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract data from the page
    console.log("Extracting page information");
    const data = await page.evaluate(() => {
      const heading = document.querySelector("h1")?.innerText || "No heading";

      // Find first meaningful paragraph
      let summary = "No content found";
      const paragraphs = document.querySelectorAll("p");

      for (let p of paragraphs) {
        if (p.innerText.trim().length > 50) {
          summary = p.innerText;
          break;
        }
      }

      return {
        title: document.title,
        heading: heading,
        summary: summary,
      };
    });

    // Save data to JSON file
    console.log("Saving scraped data to file");
    fs.writeFileSync("scraped_data.json", JSON.stringify(data, null, 2));

    console.log("Scraping completed successfully");
    console.log("Extracted data:", data);

    await browser.close();
    console.log("Browser closed");

  } catch (error) {
    console.error("Error while running scraper:", error);
  }
})();