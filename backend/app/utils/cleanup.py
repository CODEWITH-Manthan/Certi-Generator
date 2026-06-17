import shutil
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def delete_path(path: Path):
    """Recursively deletes a file or directory path."""
    try:
        if path.exists():
            if path.is_dir():
                shutil.rmtree(path)
                logger.info(f"Cleaned up directory: {path}")
            else:
                path.unlink()
                logger.info(f"Cleaned up file: {path}")
    except Exception as e:
        logger.error(f"Failed to delete {path}: {e}")
