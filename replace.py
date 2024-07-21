import os
import sys
import fnmatch
from glob import glob

def load_gitignore(gitignore_path):
	if not os.path.exists(gitignore_path):
		return []
	
	with open(gitignore_path, 'r') as file:
		gitignore_patterns = file.read().splitlines()
	
	return gitignore_patterns

def is_ignored(file_path, gitignore_patterns, root_dir):
	for pattern in gitignore_patterns:
		if pattern.startswith('#') or not pattern.strip():
			continue
		if fnmatch.fnmatch(file_path, os.path.join(root_dir, pattern)):
			return True
	return False

def replace_in_file(file_path, old_string, new_string):
	try:
		with open(file_path, 'r', encoding='utf-8') as file:
			file_contents = file.read()
	
		new_contents = file_contents.replace(old_string, new_string)
		
		with open(file_path, 'w', encoding='utf-8') as file:
			file.write(new_contents)
	except Exception:
		...

def replace_in_directory(root_dir, old_string, new_string):
	gitignore_path = os.path.join(root_dir, '.gitignore')
	gitignore_patterns = load_gitignore(gitignore_path)

	for subdir, dirs, files in os.walk(root_dir):
		# Adjust subdir to be relative to root_dir for gitignore matching
		rel_subdir = os.path.relpath(subdir, root_dir)
		
		# Filter out ignored directories
		dirs[:] = [d for d in dirs if not is_ignored(os.path.join(rel_subdir, d), gitignore_patterns, root_dir)]
		
		for file in files:
			rel_file_path = os.path.join(rel_subdir, file)
			if is_ignored(rel_file_path, gitignore_patterns, root_dir):
				continue
			replace_in_file(os.path.join(subdir, file), old_string, new_string)

if __name__ == "__main__":
	if len(sys.argv) != 4:
		print("Usage: python replace.py <root_directory> <old_string> <new_string>")
		sys.exit(1)

	root_directory = sys.argv[1]
	old_string = sys.argv[2]
	new_string = sys.argv[3]

	replace_in_directory(root_directory, old_string, new_string)
