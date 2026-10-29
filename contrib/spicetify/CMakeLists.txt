#
# Spicetify Spotify Integration & Setup Tool
#
install(PROGRAMS polybar-spotify-setup
  DESTINATION ${CMAKE_INSTALL_BINDIR}
  COMPONENT tools)

install(FILES polybar-lyrics.js
  DESTINATION ${CMAKE_INSTALL_DATADIR}/polybar/spicetify
  COMPONENT tools)
