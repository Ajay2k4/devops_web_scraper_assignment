const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  console.log("Starting scraper");

  try {
    // Read target URL from environment variable
    const url = process.env.SCRAPE_URL || "https://example.com";
    console.log("Target URL:", url);

    // Launch headless Chromium browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Navigate to the provided webpage
    console.log("Opening webpage");
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract required information from the page
    console.log("Extracting page information");
    const data = await page.evaluate(() => {
      const headingElement = document.querySelector("h1");

      return {
        title: document.title,
        heading: headingElement ? headingElement.innerText : "No heading found",
      };
    });

    // Save the scraped data to a JSON file
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