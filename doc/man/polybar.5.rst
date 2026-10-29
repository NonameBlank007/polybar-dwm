.. highlight:: ini

polybar(5)
==========

Description
-----------

The polybar configuration file defines the behavior and look of polybar. It uses
a variant of the `INI <https://en.wikipedia.org/wiki/INI_file>`_ file format.
The exact syntax is described below but first a small snippet to get familiar
with the syntax:

::

  [section_name]
  ; A comment
  # Another comment

  background = #ff992a
  width = 90%
  monitor = HDMI-0

  screenchange-reload = false

  ; Use double quotes if you want to keep the surrounding space.
  text = " Some text "

When started ``polybar`` will search for the config file in one of several
places in the following order:

* If the ``-c`` or ``--config`` command line argument is specified, it will use
  the path given there.
* ``$XDG_CONFIG_HOME/polybar/config``
* ``$XDG_CONFIG_HOME/polybar/config.ini``
* ``$HOME/.config/polybar/config``
* ``$HOME/.config/polybar/config.ini``
* ``$XDG_CONFIG_DIRS/polybar/config.ini``
* ``/etc/xdg/polybar/config.ini`` (only if ``XDG_CONFIG_DIRS`` is not set)
* ``/etc/polybar/config.ini``

Syntax
------

The entire config is line-based so everything is constrained to a single line.
This means there are no multiline values or other multiline constructs (except
for sections).
Each line has one of four types:

* Empty
* Comment
* Section Header
* Key

Spaces at the beginning and end of each line will be ignored.

.. note::

  In this context "spaces" include the regular space character as well as the
  tab character and any other character for which :manpage:`isspace(3)` returns
  ``true`` (e.g. ``\r``).

Any line that doesn't fit into one of these four types is a syntax error.

.. note::

  It is recommended that `section header` names and `key` names only use
  alphanumeric characters as well as dashes (``-``), underscores (``_``) and
  forward slashes (``/``).

  In practice all characters are allowed except for spaces and any of these:
  ``"'=;#[](){}:.$\%``

Section Headers
^^^^^^^^^^^^^^^

Sections are used to group config options together. For example each module is
defined in its own section.

A section is defined by placing the name of the section in square brackets
(``[`` and ``]``). For example:

::

  [module/wm]

This declares a section with the name ``module/wm`` and all keys defined after
this line will belong to that section until a new section is declared.

.. warning::
  The first non-empty and non-comment line in the main config file must be a
  section header. It cannot be a key because that key would not belong to any
  section.

.. note::
  The following section names are reserved and cannot be used inside the config:
  ``self``, ``root``, and ``BAR``.

Keys
^^^^

Keys are defined by assigning a value to a name like this:


::

  name = value

This assigns ``value`` to the key ``name`` in whatever section this line is in.
Key names need to be unique per section.
If the value is enclosed by double-quotes (``"``), the quotes will be ignored.
So the following still assigns ``value`` to ``name``:

::

  name = "value"

Spaces around the equal sign are ignored, the following are all equivalent:

::

  name=value
  name = value
  name =      value

Because spaces at the beginning and end of the line are also ignored, if you
want your value to begin and/or end with a space, the value needs to be enclosed
in double-quotes:

::

  name = " value "

Here the value of the ``name`` key has a leading and trailing whitespace.

To treat characters with special meaning as literal characters, you need to
prepend them with the backslash (``\``) escape character:

::

  name = "value\\value\\value"

Value of this key ``name`` results in ``value\value\value``.

.. note::

  The only character with a special meaning right now is the backslash character
  (``\``), which serves as the escape character.
  More will be added in the future.

Empty Lines & Comments
^^^^^^^^^^^^^^^^^^^^^^

Empty lines and comment lines are ignored when reading the config file, they do
not affect polybar's behavior. Comment lines start with either the ``;`` or the
``#`` character.

.. note::

  Inline comments are not supported. For example the following line does not end
  with a comment, the value of ``name`` is actually set to ``value ; comment``:

  ::

    name = value ; comment

Formatting Tags
---------------

Polybar supports inline formatting tags inside module labels and format strings:

* ``%{F<color>}...%{F-}``: Set foreground color (reset with ``%{F-}``).
* ``%{B<color>}...%{B-}``: Set background color (reset with ``%{B-}``).
* ``%{u<color>}...%{u-}``: Set underline color.
* ``%{o<color>}...%{o-}``: Set overline color.
* ``%{+u}`` / ``%{-u}``: Enable / disable underline.
* ``%{+o}`` / ``%{-o}``: Enable / disable overline.
* ``%{T<index>}``: Switch font (1-indexed).
* ``%{O<pixels>}``: Offset position horizontally.
* ``%{A<button>:<command>:}...%{A}``: Click / scroll / hover action:
  * ``1``: Left click
  * ``2``: Middle click
  * ``3``: Right click
  * ``4``: Scroll up
  * ``5``: Scroll down
  * ``6``: Double left click
  * ``7``: Double middle click
  * ``8``: Double right click
  * ``9``: Hover enter (requires ``enable-hover = true`` in bar section)
  * ``10``: Hover leave (requires ``enable-hover = true`` in bar section)
* ``%{I[<options>]:<path>}%``: Inline Cairo PNG image tag:
  Renders a PNG image from file path directly onto the bar surface using Cairo.
  The image is vertically centered within the bar height and supports full alpha transparency (ARGB32).

  **Options** (specified before the colon ``:``):

  * ``<width>x<height>``: Target dimensions in pixels (e.g. ``20x20``). If only width or height is provided, the original image aspect ratio is preserved automatically.
  * ``r<radius>``: Rounded corner radius in pixels (e.g. ``r4``). If ``radius >= width / 2``, the image renders as a smooth pill or capsule.
  * No options (``%{I:<path>}%``): Renders the image at its natural dimensions, scaled proportionally to fit the bar height.

  **Examples**:

  * ``%{I20x20r4:/tmp/cover.png}%``: Renders a 20x20 pixel cover art thumbnail with 4px rounded corners.
  * ``%{I27x18r0:/tmp/cava_0.png}%``: Renders an 18px tall dynamic audio visualizer surface.
  * ``%{I32x32:/path/to/icon.png}%``: Scales image to 32x32 pixels preserving alpha transparency.

AUTHORS
-------
| Polybar was created by Michael Carlberg and is currently maintained by Patrick Ziegler.
| Contributors can be listed on GitHub.

SEE ALSO
--------

.. only:: man

  :manpage:`polybar`\(1),
  :manpage:`polybar-msg`\(1),
  :manpage:`polybar-spotify-setup`\(1)


.. only:: not man

  :doc:`polybar.1`,
  :doc:`polybar-msg.1`,
  :doc:`polybar-spotify-setup.1`


.. only:: not man

  :doc:`polybar.1`,
  :doc:`polybar-msg.1`
