#include <windows.h>

void NTAPI tls_cb(PVOID a, DWORD r, PVOID b) {
    if (r == 1) MessageBoxA(0, "TLS callback!", "TLS", 0);
}

#pragma comment(linker, "/INCLUDE:_tls_used")
#pragma const_seg(".CRT$XLB")
EXTERN_C const PIMAGE_TLS_CALLBACK g_tls[] = { tls_cb, 0 };
#pragma const_seg()

int main() {
    MessageBoxA(0, "main()", "TLS", 0);
}
