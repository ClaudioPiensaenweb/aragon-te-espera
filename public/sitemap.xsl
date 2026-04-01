<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:ate="https://aragonteespera.com/ns">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<!-- Muench grouping key: unique ate:type values -->
<xsl:key name="types" match="sitemap:url" use="ate:type"/>

<xsl:template match="/">
<html>
<head>
    <title>Sitemap XML</title>
    <meta name="robots" content="noindex, follow"/>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; background: #f5f5f5; }
        .header { background: #111; padding: 35px 30px; }
        .header h1 { font-size: 24px; font-weight: 700; color: #fff; max-width: 1200px; margin: 0 auto; }
        .container { max-width: 1200px; margin: 0 auto; padding: 25px 20px; }
        .summary { font-size: 14px; color: #888; margin-bottom: 25px; }
        .summary strong { color: #111; }
        .section-title { font-size: 13px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 1px; margin: 30px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e5; }
        .section-title:first-of-type { margin-top: 0; }
        .section-title span { color: #bbb; font-weight: 400; margin-left: 6px; }
        table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden; margin-bottom: 10px; border: 1px solid #e5e5e5; }
        th { background: #111; color: #fff; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 16px; text-align: left; }
        td { padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #f0f0f0; color: #666; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8f9fa; }
        td a { color: #1a73e8; text-decoration: none; }
        td a:hover { color: #174ea6; text-decoration: underline; }
        .priority { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .priority-high { background: #e8f5e9; color: #2e7d32; }
        .priority-medium { background: #e3f2fd; color: #1565c0; }
        .priority-low { background: #fff3e0; color: #e65100; }
        .alt-links { display: flex; gap: 4px; }
        .alt-link { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; background: #f0f0f0; color: #666; text-decoration: none; }
        .alt-link:hover { background: #1a73e8; color: #fff; }
        @media (max-width: 768px) {
            .header { padding: 20px 15px; }
            .header h1 { font-size: 20px; }
            th, td { padding: 8px 10px; font-size: 12px; }
            .container { padding: 15px 10px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mapa del sitio XML</h1>
    </div>
    <div class="container">
        <p class="summary">
            Este sitemap contiene <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.
        </p>

        <!-- Dynamic grouping by ate:type using Muenchian method -->
        <xsl:for-each select="sitemap:urlset/sitemap:url[generate-id() = generate-id(key('types', ate:type)[1])]">
            <xsl:variable name="currentType" select="ate:type"/>
            <xsl:variable name="groupItems" select="key('types', $currentType)"/>

            <div class="section-title">
                <xsl:value-of select="translate(substring($currentType,1,1),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
                <xsl:value-of select="substring($currentType,2)"/>
                <span>(<xsl:value-of select="count($groupItems)"/>)</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 48%">URL</th>
                        <th style="width: 14%">Idiomas</th>
                        <th style="width: 12%">Prioridad</th>
                        <th style="width: 12%">Frecuencia</th>
                        <th style="width: 14%">Modificación</th>
                    </tr>
                </thead>
                <tbody>
                    <xsl:for-each select="$groupItems">
                        <xsl:sort select="sitemap:priority" order="descending"/>
                        <tr>
                            <td><a><xsl:attribute name="href"><xsl:value-of select="sitemap:loc"/></xsl:attribute><xsl:value-of select="sitemap:loc"/></a></td>
                            <td>
                                <div class="alt-links">
                                    <xsl:for-each select="xhtml:link[@rel='alternate']">
                                        <a class="alt-link"><xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute><xsl:value-of select="translate(@hreflang, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/></a>
                                    </xsl:for-each>
                                    <xsl:if test="not(xhtml:link[@rel='alternate'])"><span class="alt-link">—</span></xsl:if>
                                </div>
                            </td>
                            <td>
                                <xsl:choose>
                                    <xsl:when test="sitemap:priority &gt;= 0.9"><span class="priority priority-high"><xsl:value-of select="sitemap:priority"/></span></xsl:when>
                                    <xsl:when test="sitemap:priority &gt;= 0.7"><span class="priority priority-medium"><xsl:value-of select="sitemap:priority"/></span></xsl:when>
                                    <xsl:otherwise><span class="priority priority-low"><xsl:value-of select="sitemap:priority"/></span></xsl:otherwise>
                                </xsl:choose>
                            </td>
                            <td><xsl:value-of select="sitemap:changefreq"/></td>
                            <td><xsl:value-of select="sitemap:lastmod"/></td>
                        </tr>
                    </xsl:for-each>
                </tbody>
            </table>
        </xsl:for-each>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
