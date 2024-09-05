<template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <!-- Header -->
        <header class="bg-white shadow-sm">
            <div class="container mx-auto px-4 py-4">
                <img src="https://placehold.co/200x80" alt="Logo" class="mx-auto h-20 w-auto" />
            </div>
        </header>

        <!-- Main content -->
        <main class="flex-grow container mx-auto px-4 py-8">
            <JobSearchForm />
            <slot />
        </main>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white">
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                    <nav class="mt-4 md:mt-0">
                        <ul class="flex space-x-4">
                            <li><a href="#" class="hover:text-gray-300">About</a></li>
                            <li><a href="#" class="hover:text-gray-300">Contact</a></li>
                            <li><a href="#" class="hover:text-gray-300">Privacy Policy</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup></script>
