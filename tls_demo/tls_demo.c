#include <windows.h>
#include <stdio.h>

static void NTAPI tls_callback(PVOID module, DWORD reason, PVOID reserved) {
    (void)module;
    (void)reserved;

    if (reason == DLL_PROCESS_ATTACH) {
        MessageBoxA(NULL, "[TLS] before main", "tls_demo", MB_OK);
    }
}

#ifdef _MSC_VER
#pragma section(".CRT$XLB", long, read)
__declspec(allocate(".CRT$XLB"))
PIMAGE_TLS_CALLBACK tls_callbacks[] = { tls_callback, NULL };
#else
PIMAGE_TLS_CALLBACK tls_callbacks[]
    __attribute__((section(".CRT$XLB"), used)) = { tls_callback, NULL };
#endif

int main(void) {
    MessageBoxA(NULL, "[main] entry point", "tls_demo", MB_OK);
    puts("[main] entry point");
    return 0;
}
