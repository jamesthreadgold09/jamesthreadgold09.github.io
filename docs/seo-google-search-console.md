# Getting jamesthreadgold.co.uk into Google

This is the runbook for registering the site with Google and submitting the sitemap. The
on-site work (structured data, sitemap, robots) is already done in the repo. The steps below
are the external actions only you can do, signed in to the Google account you want to own the
listing.

## 1. Add the site to Google Search Console
Go to https://search.google.com/search-console and add a property. You have two options.

### Option A (recommended): Domain property
1. Choose **Domain** and enter `jamesthreadgold.co.uk`.
2. Google gives you a TXT record. Add it in your domain registrar's DNS settings.
3. Click **Verify**. DNS can take a little while to propagate.

This covers the whole domain (all subdomains, http and https) and needs no code change.

### Option B: URL-prefix property (HTML tag)
1. Choose **URL prefix** and enter `https://jamesthreadgold.co.uk/`.
2. Pick the **HTML tag** method and copy the token.
3. In `index.html`, find the commented Search Console line in the `<head>` and replace it
   with your real tag, for example:
   ```html
   <meta name="google-site-verification" content="PASTE_YOUR_TOKEN_HERE">
   ```
4. Deploy, then click **Verify**.

## 2. Submit the sitemap
In Search Console, open **Sitemaps** and submit:
```
https://jamesthreadgold.co.uk/sitemap.xml
```
It should report "Success" and list 7 discovered URLs.

## 3. Request indexing
Use **URL Inspection** (top search bar) for each important page, then **Request indexing**:
- `https://jamesthreadgold.co.uk/`
- the five `/work/...` case studies
- `https://jamesthreadgold.co.uk/contact/`

## 4. What to watch
- **Pages** (Indexing): which URLs are indexed and any that are excluded, with reasons.
- **Performance**: impressions, clicks and the queries you appear for, once data builds up.
- **Enhancements / Breadcrumbs**: confirms Google has picked up the breadcrumb structured
  data added to the case study pages.

## 5. Validate the structured data (optional but worth it)
Run a couple of live URLs through the Rich Results Test:
https://search.google.com/test/rich-results
- Homepage should detect **WebSite** and **Person**.
- A case study should detect **Breadcrumbs** (and the CreativeWork).

## Expected timing
A newer domain can take anywhere from a few days to a few weeks to index fully. Submitting
the sitemap and requesting indexing speeds it up, but some waiting is normal. There is nothing
more to "fix" in the code while you wait.
