#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "libjpeg-turbo::jpeg" for configuration "Release"
set_property(TARGET libjpeg-turbo::jpeg APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(libjpeg-turbo::jpeg PROPERTIES
  IMPORTED_LOCATION_RELEASE "/Applications/EasySrv/Library/jpeg-turbo/lib/libjpeg.8.2.2.dylib"
  IMPORTED_SONAME_RELEASE "@rpath/libjpeg.8.dylib"
  )

list(APPEND _cmake_import_check_targets libjpeg-turbo::jpeg )
list(APPEND _cmake_import_check_files_for_libjpeg-turbo::jpeg "/Applications/EasySrv/Library/jpeg-turbo/lib/libjpeg.8.2.2.dylib" )

# Import target "libjpeg-turbo::turbojpeg" for configuration "Release"
set_property(TARGET libjpeg-turbo::turbojpeg APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(libjpeg-turbo::turbojpeg PROPERTIES
  IMPORTED_LOCATION_RELEASE "/Applications/EasySrv/Library/jpeg-turbo/lib/libturbojpeg.0.2.0.dylib"
  IMPORTED_SONAME_RELEASE "@rpath/libturbojpeg.0.dylib"
  )

list(APPEND _cmake_import_check_targets libjpeg-turbo::turbojpeg )
list(APPEND _cmake_import_check_files_for_libjpeg-turbo::turbojpeg "/Applications/EasySrv/Library/jpeg-turbo/lib/libturbojpeg.0.2.0.dylib" )

# Import target "libjpeg-turbo::turbojpeg-static" for configuration "Release"
set_property(TARGET libjpeg-turbo::turbojpeg-static APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(libjpeg-turbo::turbojpeg-static PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELEASE "ASM_NASM;C"
  IMPORTED_LOCATION_RELEASE "/Applications/EasySrv/Library/jpeg-turbo/lib/libturbojpeg.a"
  )

list(APPEND _cmake_import_check_targets libjpeg-turbo::turbojpeg-static )
list(APPEND _cmake_import_check_files_for_libjpeg-turbo::turbojpeg-static "/Applications/EasySrv/Library/jpeg-turbo/lib/libturbojpeg.a" )

# Import target "libjpeg-turbo::jpeg-static" for configuration "Release"
set_property(TARGET libjpeg-turbo::jpeg-static APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(libjpeg-turbo::jpeg-static PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELEASE "ASM_NASM;C"
  IMPORTED_LOCATION_RELEASE "/Applications/EasySrv/Library/jpeg-turbo/lib/libjpeg.a"
  )

list(APPEND _cmake_import_check_targets libjpeg-turbo::jpeg-static )
list(APPEND _cmake_import_check_files_for_libjpeg-turbo::jpeg-static "/Applications/EasySrv/Library/jpeg-turbo/lib/libjpeg.a" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
