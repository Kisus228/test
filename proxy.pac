// =========================
// CONFIGURATION
// =========================

// Proxy endpoint
var PROXY = "SOCKS5 127.0.0.1:1488"; // <-- change port if needed

// Exact domains (and subdomains automatically included)
var DOMAIN_WHITELIST = [
    "2ip.ru"
];

// Pattern-based rules (wildcards)
var PATTERN_WHITELIST = [
    "*.domain.org"
];

// Optional: direct IP ranges (bypass proxy)
var DIRECT_NETS = [
    { net: "192.168.0.0", mask: "255.255.0.0" },
    { net: "10.0.0.0", mask: "255.0.0.0" },
    { net: "172.16.0.0", mask: "255.240.0.0" }
];


// =========================
// HELPER FUNCTIONS
// =========================

// Match domain or any subdomain
function matchDomain(host, domain) {
    return host === domain || dnsDomainIs(host, "." + domain);
}

// Check domain whitelist
function isWhitelistedDomain(host) {
    for (var i = 0; i < DOMAIN_WHITELIST.length; i++) {
        if (matchDomain(host, DOMAIN_WHITELIST[i])) {
            return true;
        }
    }
    return false;
}

// Check wildcard patterns
function isWhitelistedPattern(host) {
    for (var i = 0; i < PATTERN_WHITELIST.length; i++) {
        if (shExpMatch(host, PATTERN_WHITELIST[i])) {
            return true;
        }
    }
    return false;
}

// Check direct IP ranges
function isDirectIP(host) {
    var ip = dnsResolve(host);
    if (!ip) return false;

    for (var i = 0; i < DIRECT_NETS.length; i++) {
        if (isInNet(ip, DIRECT_NETS[i].net, DIRECT_NETS[i].mask)) {
            return true;
        }
    }
    return false;
}


// =========================
// MAIN LOGIC
// =========================

function FindProxyForURL(url, host) {

    // Always bypass plain hostnames (optional)
    if (isPlainHostName(host)) {
        return "DIRECT";
    }

    // Bypass local networks
    if (isDirectIP(host)) {
        return "DIRECT";
    }

    // Whitelist → use proxy
    if (isWhitelistedDomain(host) || isWhitelistedPattern(host)) {
        return PROXY;
    }

    // Default → DIRECT (whitelist behavior)
    return "DIRECT";
}
