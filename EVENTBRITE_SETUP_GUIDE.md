# Eventbrite API Setup Guide

## 🎯 Quick Start Guide

Follow these steps to get your Eventbrite API integration working:

---

## Step 1: Get Your Eventbrite API Token

### Option A: Use Public Token (Easiest - Recommended)

1. **Visit:** https://www.eventbrite.com/platform/api#/introduction/authentication
2. **Sign up/Login** to Eventbrite (free account)
3. **Go to:** https://www.eventbrite.com/account-settings/apps
4. **Click:** "Create New API Key"
5. **Fill in:**
   - Application Name: "321 La Quinta Website"
   - Application URL: Your website URL
   - Description: "Event display for vacation rental website"
6. **Click:** "Create Key"
7. **Copy** your "Private Token" (looks like: `ABCDEFGH12345678`)

### Option B: Use OAuth (More Complex)

If you need more advanced features, follow Eventbrite's OAuth guide:
https://www.eventbrite.com/platform/api#/introduction/authentication

---

## Step 2: Add Token to Website

1. **Open:** `website/eventbrite-integration.js`
2. **Find line 8:**
   ```javascript
   token: 'YOUR_EVENTBRITE_TOKEN_HERE',
   ```
3. **Replace** with your actual token:
   ```javascript
   token: 'ABCDEFGH12345678',
   ```
4. **Save** the file

---

## Step 3: Add Script to HTML

The script is already referenced in your HTML file. Just verify it's there:

```html
<script src="eventbrite-integration.js"></script>
```

This should be just before the closing `</body>` tag.

---

## Step 4: Test the Integration

1. **Open** your website in a browser
2. **Navigate** to the "Major Events Near You" section
3. **Check** if events are loading
4. **Open browser console** (F12) to see any errors

---

## 🔧 Configuration Options

### Adjust Search Radius

In `eventbrite-integration.js`, line 12:
```javascript
'location.within': '50mi', // Change to 25mi, 75mi, etc.
```

### Change Number of Events Displayed

Line 14:
```javascript
'page_size': 20 // Change to 10, 30, etc.
```

### Modify Priority Venues

Lines 18-26:
```javascript
priorityVenues: [
    'PGA West',
    'Indian Wells Tennis Garden',
    // Add or remove venues
]
```

---

## 🎨 Customization

### Event Card Styling

The events use the same CSS classes as your attractions section:
- `.event-card` - Main card container
- `.event-image` - Background image area
- `.event-content` - Text content area
- `.event-date` - Date badge
- `.event-distance` - Distance badge

### Fallback Events

If the API fails or returns no events, the system shows 7 curated fallback events (PGA Golf, Coachella, etc.). These are defined in `FALLBACK_EVENTS` starting at line 39.

---

## 🔄 How Auto-Updates Work

1. **Initial Load:** Events fetch when page loads
2. **Auto-Refresh:** Events refresh every hour automatically
3. **Fallback:** If API fails, shows curated major events
4. **Smart Merging:** Combines API events with major annual events

---

## 📊 What Gets Displayed

### Priority Events (Shown First):
- PGA West events
- Indian Wells Tennis Garden events
- Empire Polo Club events (Coachella, Stagecoach)
- Acrisure Arena events
- Desert Horse Park events
- McCallum Theatre events
- La Quinta Arts Foundation events

### Other Events:
- Community events within 50 miles
- Concerts, sports, arts events
- Food & drink festivals
- Performing arts

### Always Included (Fallback):
- American Express PGA Golf Tournament
- Desert Horse Park Events
- BNP Paribas Open Tennis
- La Quinta Arts Festival
- Coachella Music Festival
- Stagecoach Festival
- Acrisure Arena Events

---

## 🐛 Troubleshooting

### Events Not Loading?

1. **Check Console:** Press F12, look for errors
2. **Verify Token:** Make sure token is correct in line 8
3. **Check Network:** Look at Network tab in browser dev tools
4. **API Limits:** Eventbrite free tier has rate limits

### Only Showing Fallback Events?

This means the API isn't connecting. Possible causes:
- Invalid token
- Rate limit exceeded
- Network issues
- CORS issues (need to enable on Eventbrite)

### Wrong Events Showing?

Adjust the search parameters:
- Change `location.within` radius
- Modify `priorityVenues` list
- Update `categories` filter

---

## 📈 API Rate Limits

**Eventbrite Free Tier:**
- 1,000 requests per hour
- 50,000 requests per day

**Your Website Usage:**
- ~1 request per page load
- ~24 requests per day (hourly refresh)
- Well within free limits!

---

## 🔒 Security Notes

1. **Token Security:** Your token is visible in the JavaScript file. This is okay for public event data.
2. **CORS:** Eventbrite API supports CORS for browser requests
3. **Rate Limiting:** The script includes automatic fallback if limits are hit

---

## 🎯 Testing Checklist

- [ ] Token added to eventbrite-integration.js
- [ ] Script included in HTML
- [ ] Website loads without errors
- [ ] Events section shows events
- [ ] Event titles are clickable links
- [ ] Google Maps links work
- [ ] Events auto-refresh (wait 1 hour or test manually)
- [ ] Fallback events work (test by using invalid token)

---

## 📞 Support

If you need help:
1. Check browser console for errors
2. Verify token is correct
3. Test with fallback events first
4. Check Eventbrite API status: https://status.eventbrite.com/

---

## 🚀 Going Live

Once tested:
1. ✅ Verify token is working
2. ✅ Test on multiple browsers
3. ✅ Check mobile responsiveness
4. ✅ Verify all links work
5. ✅ Deploy to production

---

**Estimated Setup Time:** 10-15 minutes
**Maintenance Required:** None (fully automatic)
**Cost:** FREE forever

---

*Your events will now update automatically from Eventbrite! 🎉*