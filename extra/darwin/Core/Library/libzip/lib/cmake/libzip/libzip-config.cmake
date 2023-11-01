
####### Expanded from @PACKAGE_INIT@ by configure_package_config_file() #######
####### Any changes to this file will be overwritten by the next CMake run ####
####### The input file was libzip-config.cmake.in                            ########

get_filename_component(PACKAGE_PREFIX_DIR "${CMAKE_CURRENT_LIST_DIR}/../../../" ABSOLUTE)

macro(set_and_check _var _file)
  set(${_var} "${_file}")
  if(NOT EXISTS "${_file}")
    message(FATAL_ERROR "File or directory ${_file} referenced by variable ${_var} does not exist !")
  endif()
endmacro()

macro(check_required_components _NAME)
  foreach(comp ${${_NAME}_FIND_COMPONENTS})
    if(NOT ${_NAME}_${comp}_FOUND)
      if(${_NAME}_FIND_REQUIRED_${comp})
        set(${_NAME}_FOUND FALSE)
      endif()
    endif()
  endforeach()
endmacro()

####################################################################################

# We need to supply transitive dependencies if this config is for a static library
set(IS_SHARED ON)
if (NOT IS_SHARED)
  include(CMakeFindDependencyMacro)
  set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_CURRENT_LIST_DIR}/modules")

  set(ENABLE_BZIP2 TRUE)
  set(ENABLE_LZMA TRUE)
  set(ENABLE_ZSTD FALSE)
  set(ENABLE_GNUTLS )
  set(ENABLE_MBEDTLS )
  set(ENABLE_OPENSSL )

  find_dependency(ZLIB 1.1.2)
  if(ENABLE_BZIP2)
    find_dependency(BZip2)
  endif()

  if(ENABLE_LZMA)
    find_dependency(LibLZMA 5.2)
  endif()

  if(ENABLE_ZSTD)
    find_dependency(zstd 1.3.6)
  endif()

  if(ENABLE_GNUTLS)
    find_dependency(Nettle 3.0)
    find_dependency(GnuTLS)
  endif()
  if(ENABLE_MBEDTLS)
    find_dependency(MbedTLS 1.0)
  endif()
  if(ENABLE_OPENSSL)
    find_dependency(OpenSSL)
  endif()
endif()

# Provide all our library targets to users.
include("${CMAKE_CURRENT_LIST_DIR}/libzip-targets.cmake")

check_required_components(libzip)

