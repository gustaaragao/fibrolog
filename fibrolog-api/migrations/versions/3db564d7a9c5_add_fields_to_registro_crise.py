"""add fields to registro_crise

Revision ID: 3db564d7a9c5
Revises: 429d5bedb7e9
Create Date: 2026-02-08 18:32:24.472859

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3db564d7a9c5'
down_revision: Union[str, Sequence[str], None] = '429d5bedb7e9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('registros_crises', sa.Column('duracao', sa.String(), nullable=True))
    op.add_column('registros_crises', sa.Column('sintomas_relatados', sa.Text(), nullable=True))
    op.add_column('registros_crises', sa.Column('observacoes', sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('registros_crises', 'observacoes')
    op.drop_column('registros_crises', 'sintomas_relatados')
    op.drop_column('registros_crises', 'duracao')
