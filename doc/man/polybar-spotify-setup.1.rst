polybar-spotify-setup(1)
========================

SYNOPSIS
--------
**polybar-spotify-setup** [*OPTIONS*]

DESCRIPTION
-----------
**polybar-spotify-setup** installs and configures the Polybar lyrics integration extension for Spicetify.

It discovers the user's active Spicetify configuration, copies ``polybar-lyrics.js`` into the Spicetify extensions directory, enables the extension, and runs ``spicetify apply``.

When Spotify runs with this extension enabled, synchronized lyrics and player states are broadcast via local HTTP requests on port 8974 directly to the Polybar music bridge daemon, eliminating the need for fuzzy web scraping.

OPTIONS
-------
.. program:: polybar-spotify-setup

.. option:: -h, --help

   Display help message and exit

.. option:: -u, --uninstall

   Disable and remove the Polybar lyrics extension from Spicetify

AUTHORS
-------
| Noname Blank and contributors.
| Originally inspired by Tide Island Spotify bridge.

SEE ALSO
--------
:manpage:`polybar`\(1),
:manpage:`polybar`\(5)
