if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "/home/nabor/Área de trabalho/gestãoConsciente/GestaoConsciente/node_modules/react-native-worklets/android/build/intermediates/cxx/Debug/6j3p2e21/obj/x86/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/nabor/Área de trabalho/gestãoConsciente/GestaoConsciente/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

